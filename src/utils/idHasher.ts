import Hashids from 'hashids';

const HASHIDS_SALT = process.env.NEXT_PUBLIC_HASHIDS_SALT;
const hashids = new Hashids(HASHIDS_SALT, 16);

export function encodeId(id: number): string {
    return hashids.encode(id);
}

export function decodeId(hash: string): number | null {
    const decoded = hashids.decode(hash);
    if (decoded.length > 0 && typeof decoded[0] === 'number') {
        return decoded[0];
    }
    return null;
}