export type CustomTreatyResponse<Res extends Record<number, unknown>> = {
    data: Res[200];
    error: null;
    response: Response;
    status: number;
    headers: FetchRequestInit['headers'];
} | {
    data: null;
    error: Exclude<keyof Res, 200> extends never ? {
        status: any;
        value: any;
    } : {
        [Status in keyof Res]: {
            status: Status;
            value: Res[Status];
        };
    }[Exclude<keyof Res, 200>];
    response: Response;
    status: number;
    headers: FetchRequestInit['headers'];
};
