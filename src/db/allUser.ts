import type {User, UserSession} from '../types/user';


const allUsers: User[] = [
    {
        email: 'test1@test.com',
        password: '$2b$10$UlvHfas2mRaMcyJgGFWxOeJUnbdNa2x5VJ/jh47S2du/U.lCX1M0C',
        name: 'test1',
        Auth: 'Password'
    },
    {
        email: 'test11@test.com',
        password: '$2b$10$UlvHfas2mRaMcyJgGFWxOeJUnbdNa2x5VJ/jh47S2du/U.lCX1M0C',
        name: 'test1',
        Auth: 'Password'
    },
    {
        email: 'test2@test.com',
        name: 'test1',
        Auth: 'OAuth'
    },
    {
        email: 'test3@test.com',
        name: 'test1',
        Auth: 'OAuth'
    },
    {
        email: '109228@g.elearn.uz.zgora.pl',
        name: 'test1',
        Auth: 'OAuth'
    },

]


export const sessions: Record<string, UserSession> = {};

export function getSession(sessionId: string) {
    const session = sessions[sessionId];

    return session && session.valid ? session : null;
}

export function invalidateSession(sessionId: string) {
    const session = sessions[sessionId];

    if (session) {
        sessions[sessionId].valid = false;
    }

    return sessions[sessionId];
}

export function createSession(email: string, name: string): UserSession {
    //if email exist just change valid to true

    let session = Object.values(sessions).find((session) => session.email === email);
    if (session) {
        session.valid = true;
        return session;
    }
    const sessionId = String(Object.keys(sessions).length + 1);

     session = {sessionId, email, valid: true, name};

    sessions[sessionId] = session;

    return session;
}

export function getUserByEmail(email: string) {
    return allUsers.find((user) => user.email === email);
}

export function createUser({email, password, name, Auth}: User): User {


    allUsers.push({email, password, name, Auth});
    return {email, password, name, Auth};
}