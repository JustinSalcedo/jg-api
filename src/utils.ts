export function verifyPayload(payload: { [key: string]: string | string[] | Date | any[] }) {
    const verified = {}
    Object.entries(payload).forEach(([key, value]) => {
        if(value) verified[key] = value
    })
    return verified
}