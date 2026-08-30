/**
 * Optional demo-data seed, run with: npm run seed
 *
 * TechCare itself has no separate seed step (the schema is provisioned on
 * boot and that's it) but the original Laravel app shipped a
 * DatabaseSeeder with three demo logins, which is genuinely useful for
 * trying the app out -- ported here as an opt-in script rather than
 * something that runs automatically.
 *
 * Every seeded account uses the password "password". Fine for local
 * development/demo; never use this on a real deployment.
 */
import bcrypt from "bcryptjs";
import { connectNeon, sql } from "../config/db.js";
import { generatePatientId, generateUserId } from "../utils/generateId.js";

async function main() {
  await connectNeon();
  const password = await bcrypt.hash("password", 10);

  const adminId = await generateUserId();
  await sql`
    INSERT INTO users (user_id, name, email, password, role)
    VALUES (${adminId}, 'Admin User', 'admin@healthtrack.test', ${password}, 'admin')
    ON CONFLICT (email) DO NOTHING
  `;

  const hwId = await generateUserId();
  await sql`
    INSERT INTO users (user_id, name, email, password, role)
    VALUES (${hwId}, 'Health Worker User', 'healthworker@healthtrack.test', ${password}, 'health_worker')
    ON CONFLICT (email) DO NOTHING
  `;

  const patientUserId = await generateUserId();
  await sql`
    INSERT INTO users (user_id, name, email, password, role)
    VALUES (${patientUserId}, 'Juan Dela Cruz', 'patient@healthtrack.test', ${password}, 'patient')
    ON CONFLICT (email) DO NOTHING
  `;

  const patientId = await generatePatientId();
  await sql`
    INSERT INTO patients (
      patient_id, user_id, first_name, middle_name, last_name, sex, birthdate,
      civil_status, blood_type, occupation, barangay_id_number, contact_number,
      address, emergency_contact_name, emergency_contact_number
    ) VALUES (
      ${patientId}, ${patientUserId}, 'Juan', 'Santos', 'Dela Cruz', 'male', '1991-04-17',
      'married', 'O+', 'Driver', 'BRGY-0001', '09171234567',
      'Mambog I, Bacoor, Cavite', 'Maria Dela Cruz', '09179876543'
    )
    ON CONFLICT DO NOTHING
  `;

  console.log('Seeded accounts (password: "password"):');
  console.log("  admin@healthtrack.test          -- Admin");
  console.log("  healthworker@healthtrack.test  -- Health Worker");
  console.log("  patient@healthtrack.test       -- Patient");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
