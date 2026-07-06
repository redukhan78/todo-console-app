const db = require('../config/database');

class Task {
    static async create(userId, title, description, dueDate, priority) {
        const query = `
            INSERT INTO tasks (user_id, title, description, due_date, priority)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [userId, title, description, dueDate, priority]);
        return result.insertId;
    }

    static async findByUserId(userId) {
        const query = 'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC';
        const [rows] = await db.execute(query, [userId]);
        return rows;
    }

    static async findById(taskId, userId) {
        const query = 'SELECT * FROM tasks WHERE id = ? AND user_id = ?';
        const [rows] = await db.execute(query, [taskId, userId]);
        return rows[0];
    }

    static async update(taskId, userId, updates) {
        const fields = [];
        const values = [];

        if (updates.title) {
            fields.push('title = ?');
            values.push(updates.title);
        }
        if (updates.description !== undefined) {
            fields.push('description = ?');
            values.push(updates.description);
        }
        if (updates.due_date) {
            fields.push('due_date = ?');
            values.push(updates.due_date);
        }
        if (updates.priority) {
            fields.push('priority = ?');
            values.push(updates.priority);
        }
        if (updates.status) {
            fields.push('status = ?');
            values.push(updates.status);
        }

        values.push(taskId, userId);
        const query = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;
        const [result] = await db.execute(query, values);
        return result.affectedRows > 0;
    }

    static async delete(taskId, userId) {
        const query = 'DELETE FROM tasks WHERE id = ? AND user_id = ?';
        const [result] = await db.execute(query, [taskId, userId]);
        return result.affectedRows > 0;
    }

    static async search(userId, keyword) {
        const query = `
            SELECT * FROM tasks
            WHERE user_id = ?
              AND (title LIKE ? OR description LIKE ?)
            ORDER BY created_at DESC
        `;
        const searchTerm = `%${keyword}%`;
        const [rows] = await db.execute(query, [userId, searchTerm, searchTerm]);
        return rows;
    }
}

module.exports = Task;