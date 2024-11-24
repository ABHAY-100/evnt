declare module 'input' {
    export default {
        text: (prompt: string) => Promise<string>,
        confirm: (prompt: string) => Promise<boolean>,
        select: (prompt: string, choices: string[]) => Promise<string>
    };
}
