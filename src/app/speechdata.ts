import { IIntent } from './model';

export const speechData: IIntent[] = [
    {
        intent: "UNDO",
        regex: "undo\\s?(it)?\\s?(please)?",
        response: [
            "Working on it",
            "Doing it",
            "Okay, on it"
        ],
        slots: [
        ],
        action: "UNDO",
        sample: [
            "Undo",
            "Undo please",
            "Undo it",
            "Undo it please"
        ],
        base: "undo"
    },
    {
        intent: "CREATE VARIABLE",
        regex: "variable\\s?(?<VARIABLE_NAME>\\w*)?\\s?(equals)?\\s?(?<TYPE>number)?\\s?(?<VALUE>.*)?",
        response: [
            "Okay, creating it",
            "I am working on it",
            "Okay, creating {{VARIABLE_NAME}}",
            "{{VARIABLE_NAME}} is on the way"
        ],
        slots: [
            {
                name: "VARIABLE_NAME",
                displayName: "Variable Name",
                regex: "\\w+",
                question: [
                    "What should be the variable name?",
                    "What you want to call it?",
                ],
                optional: false
            },
            {
                name: "VALUE",
                displayName: "Variable Value",
                regex: "",
                question: [
                ],
                optional: true
            },
            {
                name: "TYPE",
                displayName: "Variable Type",
                regex: "",
                question: [
                ],
                optional: true
            }
        ],
        action: "CREATE_VARIABLE",
        sample: [
            "Variable x equals number 5",
            "Variable value equals test",
            "Variable test"
        ],
        base: "variable"
    },
    {
        intent: "GO TO LINE",
        regex: "(go|move) to line (number)?\\s?(?<LINE_NUMBER>\\d*)$",
        response: [
            "Moving to {{LINE_NUMBER}}",
            "Okay, sure",
            "I am working on it",
            "Okay, going to the line number {{LINE_NUMBER}}"
        ],
        slots: [
            {
                name: "LINE_NUMBER",
                displayName: "Line Number",
                regex: "\\d+",
                question: [
                    "Which line do you want to go to?",
                    "Do you have line number in mind?",
                    "Please give a line number to go."
                ],
                optional: false
            }
        ],
        action: "GO_TO_LINE",
        sample: [
            "Go to line number 5",
            "Go to line",
            "Move to line number",
            "Move to line number 10"
        ],
        base: "go to line number"
    },
    {
        intent: "CREATE FUNCTION",
        regex: "create a function\\s?(named|name)?\\s?(?<FUNCTION_NAME>\\w*)?\\s?(with)?\\s?(?<ARGUMENTS>\\d*)?\\s?(arguments)?",
        response: [
            "Okay, creating function {{FUNCTION_NAME}}",
            "Creating {{FUNCTION_NAME}} with {{ARGUMENTS}} arguments",
            "Working on it",
            "{{FUNCTION_NAME}} function in progress",
            "Sure, doing it"
        ],
        slots: [
            {
                name: "FUNCTION_NAME",
                displayName: "Function Name",
                regex: "^\\w+$",
                question: [
                    "What should be the function name?"
                ],
                optional: false
            },
            {
                name: "ARGUMENTS",
                displayName: "Total Arguments",
                regex: "^\\d+$",
                question: [
                    "How many arguments should it have?"
                ],
                optional: false
            }
        ],
        action: "CREATE_FUNCTION",
        sample: [
            "Create a function named test with 3 arguments",
            "Create a function named test",
            "Create a function",
            "Create a function with 2 arguments"
        ],
        base: "create a function"
    },
    {
        intent: "RETURN",
        regex: "return\\s?(?<VARIABLE>\\w*)?",
        response: [
            "Adding return",
            "Okay, adding return",
            "Working on it",
            "Returning {{VARIABLE}}"
        ],
        slots: [
            {
                name: "VARIABLE",
                displayName: "Variable To Return",
                regex: "",
                question: [
                ],
                optional: true
            }
        ],
        action: "RETURN",
        sample: [
            "Return",
            "Return x",
        ],
        base: "return"
    },
    {
        intent: "RUN CODE",
        regex: "(run|execute)\\s?(code)?\\s?(please)?",
        response: [
            "Okay, executing it",
            "Running it",
            "Okay, running it"
        ],
        slots: [
        ],
        action: "RUN_CODE",
        sample: [
            "Run",
            "Execute",
            "Execute code it",
            "Run code please",
            "Run it",
        ],
        base: "run code"
    },
    {
        intent: "LOG CODE",
        regex: "(log)\\s?(?<TYPE>string)?\\s?(?<EXPRESSION>.*)?",
        response: [
            "Okay, doing it",
            "Logging {{EXPRESSION}}",
            "Working on it"
        ],
        slots: [
            {
                name: "EXPRESSION",
                displayName: "Expression To Log",
                regex: ".*",
                question: [
                    "What you want to log?"
                ],
                optional: false
            },
            {
                name: "TYPE",
                displayName: "Expression Type",
                regex: "",
                question: [
                ],
                optional: true
            }
        ],
        action: "LOG_CODE",
        sample: [
            "Log x",
            "Log a + b",
        ],
        base: "log"
    },
    {
        intent: "CALL FUNCTION",
        regex: "call\\s?(function)?\\s?(?<FUNCTION_NAME>\\w*)?\\s?(with)?\\s?(?<ARGUMENTS>.*)?",
        response: [
            "Okay, doing it",
            "Calling function {{FUNCTION_NAME}}",
            "Working on it"
        ],
        slots: [
            {
                name: "FUNCTION_NAME",
                displayName: "Function Name",
                regex: "\\w+",
                question: [
                    "What should be the function name?"
                ],
                optional: false
            },
            {
                name: "ARGUMENTS",
                displayName: "Arguments",
                regex: ".+",
                question: [
                    "What should be the arguments?"
                ],
                optional: false
            }
        ],
        action: "CALL_FUNCTION",
        sample: [
            "Call function",
            "Call function total with a, b and c",
            "Call function test",
            "Call function test with sum and total",
        ],
        base: "call function"
    },
]