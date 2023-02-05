
export interface IBackend {
  send(channel: string, data: any): void;
  receive(channel: string, func: any): void;
  request(channel: string, ...args: any[]): Promise<any>;
}