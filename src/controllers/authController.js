const User = require('../models/User');
const readlineSync = require('readline-sync');

class AuthController {
    static async register() {
        console.log('\n=== Registration ===\n');

        const name = readlineSync.question('Enter your name: ');
        if (!name || name.trim() === '') {
            console.log('Name cannot be empty.');
            return false;
        }

        const email = readlineSync.question('Enter your email: ');
        if (!email || !email.includes('@') || !email.includes('.')) {
            console.log('Invalid email format.');
            return false;
        }

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            console.log('Email already exists.');
            return false;
        }

        const password = readlineSync.question('Enter your password: ', { hideEchoBack: true });
        if (!password || password.length < 4) {
            console.log('Password must be at least 4 characters.');
            return false;
        }

        await User.create(name, email, password);
        console.log('\n✅ Registration successful!\n');
        return true;
    }

    static async login() {
        console.log('\n=== Login ===\n');

        const email = readlineSync.question('Enter your email: ');
        const password = readlineSync.question('Enter your password: ', { hideEchoBack: true });

        const user = await User.findByEmail(email);
        if (!user) {
            console.log('Invalid email or password.');
            return null;
        }

        const isValid = await User.validatePassword(password, user.password);
        if (!isValid) {
            console.log('Wrong credential');
            return null;
        }

        console.log('\n✅ Login successful!\n');
        return user;
    }
}

module.exports = AuthController;