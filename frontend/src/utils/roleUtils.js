export function isStudent(user) {
  return user?.role === 'student';
}

export function isTeacher(user) {
  return user?.role === 'teacher';
}
