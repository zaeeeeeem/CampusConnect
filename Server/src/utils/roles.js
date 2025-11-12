export const Roles = {
  STUDENT: 'student',
  FACULTY: 'faculty',
  CLUB_ADMIN: 'club_admin',
  ADMIN: 'admin',
};

export const isAdmin = (role) => role === Roles.ADMIN;
export const isClubAdmin = (role) => role === Roles.CLUB_ADMIN || role === Roles.ADMIN;
