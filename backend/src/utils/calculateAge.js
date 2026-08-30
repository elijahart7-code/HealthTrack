/**
 * Age in whole years from a birthdate. Duplicated in
 * frontend/src/utils/calculateAge.js -- same duplication TechCare has
 * between its backend and frontend copies; keep both in sync.
 */
export function calculateAge(birthdate) {
  const dob = typeof birthdate === "string" ? new Date(birthdate) : birthdate;
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
}
