export enum EditorActions {
    GO_TO_LINE = "GO_TO_LINE",
    CREATE_FUNCTION = "CREATE_FUNCTION",
    UNDO = "UNDO",
    CREATE_VARIABLE = "CREATE_VARIABLE",
    RETURN = "RETURN",
    RUN_CODE = "RUN_CODE",
    LOG_CODE = "LOG_CODE",
    CALL_FUNCTION = "CALL_FUNCTION"
}

export interface IEditorAction {
    action: EditorActions;
    value: any;
}

export interface ISlot {
    name: string;
    displayName: string;
    regex: string;
    question: string[];
    value?: string;
    optional: boolean;
}


export interface IIntent {
    intent: string;
    regex: string;
    response: string[];
    slots: ISlot[];
    action: string;
    sample: string[];
    base: string;
}