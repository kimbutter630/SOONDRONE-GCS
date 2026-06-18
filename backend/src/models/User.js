// 사용자 모델 (임시)
class User {
  constructor(id, username, email, role, status) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.role = role; // admin, operator, viewer
    this.status = status; // pending, active, suspended
    this.created_at = new Date();
    this.updated_at = new Date();
  }
}

module.exports = User;
