import {compare} from 'bcrypt';

export async function hashComparison(text: string, hashed: string) {
    return await compare(text, hashed);
}


