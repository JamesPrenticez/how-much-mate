export interface MockSessionArgs {
    type: string;
    name: string;
    service: string;
}

export const createMockSessionToken = (args: MockSessionArgs) => {
    const data = {
        ...args,
    };

    return btoa(JSON.stringify(data));
};

export const createMockUserSessionToken = (
    username: string,
    credits: number,
    currency: string,
    nicknamePrompt?: boolean
) => {
    return btoa(
        JSON.stringify({
            username,
            credits,
            type: 'user',
            currency,
            nicknamePrompt,
        })
    );
};