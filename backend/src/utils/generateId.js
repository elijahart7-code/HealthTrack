import crypto from "node:crypto";
import { sql } from "../config/db.js";

/**
 * Human-readable IDs -- deliberately NOT TechCare's "count existing rows in
 * a date/prefix scope, then increment" scheme. This generates a short
 * random code and checks it for collisions instead:
 *
 *   PAT-7K4QXNPF, USR-B2FZM9WT, APT-H8CDRV3K, DGX-2QNFT6JX, ...
 *
 * Why: a counter query has to scan/LIKE-match existing rows and is prone to
 * a race condition if two requests generate an ID in the same instant
 * (both read the same "last" row before either insert commits). A random
 * code sidesteps both problems -- no scan, no shared counter to race on --
 * at the cost of a (vanishingly unlikely) collision, which is checked for
 * and retried.
 *
 * CODE_ALPHABET is Crockford's base32: no 0/O, 1/I/L, or U, so a code read
 * aloud or copied by hand can't be misread. 8 characters from a 30-symbol
 * alphabet is ~39 bits of randomness (~600 billion combinations) per ID.
 */
const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ";
const CODE_LENGTH = 8;

function randomCode() {
  const bytes = crypto.randomBytes(CODE_LENGTH);
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return code;
}

async function generateUniqueId(table, idColumn, prefix) {
  // Collisions are astronomically unlikely at this length, but check
  // anyway and retry rather than trust probability alone.
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = `${prefix}-${randomCode()}`;

    const rows = await sql.query(`SELECT 1 FROM ${table} WHERE ${idColumn} = $1 LIMIT 1`, [candidate]);

    if (rows.length === 0) return candidate;
  }

  throw new Error(`Could not generate a unique ID for ${table} after 5 attempts.`);
}

export const generateUserId = () => generateUniqueId("users", "user_id", "USR");
export const generatePatientId = () => generateUniqueId("patients", "patient_id", "PAT");
export const generateAppointmentId = () => generateUniqueId("appointments", "appointment_id", "APT");

/** One prefix per clinical-record table, keyed the same way RECORD_TYPES is. */
const RECORD_TABLE_PREFIX = {
  midwife_notes: "NOTE",
  medical_histories: "HIST",
  allergies: "ALG",
};

export function generateRecordId(table) {
  const prefix = RECORD_TABLE_PREFIX[table] ?? "REC";
  return generateUniqueId(table, "record_id", prefix);
}
