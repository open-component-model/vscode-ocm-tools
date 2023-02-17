import { ChildProcess } from 'child_process';
import * as shell from 'shelljs';

export interface ShellResult {
    readonly code: number;
    readonly stdout: string;
    readonly stderr: string;
}

export async function exec(cmd: string, opts: any, callback?: ((proc: ChildProcess) => void) | null, stdin?: string): Promise<ShellResult> {
    return new Promise<any>(resolve => {
        const proc = shell.exec(cmd, opts, (code: any, stdout: any, stderr: any) => resolve({ code: code, stdout: stdout, stderr: stderr }));
        if (stdin) {
            proc.stdin?.end(stdin);
        }
        if (callback) {
            callback(proc);
        }
    });
}

