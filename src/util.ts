import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { discourseCN, famousQuotesCN, backWordsCN, preWordsCN } from "./template.cn";
import { discourseEN, famousQuotesEN, backWordsEN, preWordsEN } from "./template.en";

const findDir = (filePath: string) => {
    if (fs.statSync(filePath).isFile()) {
        return path.dirname(filePath);
    }
    return filePath;
};

const makeDirSync = (dir: string) => {
    if (fs.existsSync(dir)) {
        return;
    }
    if (!fs.existsSync(path.dirname(dir))) {
        makeDirSync(path.dirname(dir));
    }
    fs.mkdirSync(dir);
};

export const generateBullShit = (file: any) => {
    vscode.window.showInputBox({
        value: "",
        prompt: "topic",
        ignoreFocusOut: true,
        valueSelection: [-1, -1],
    }).then((name: string | undefined) => {
        if (!name) {
            return;
        }
        const topic = name.charAt(0).toUpperCase() + name.slice(1);
        const dir = findDir(file.fsPath);
        const article = generateArticle(topic);
        fs.createWriteStream(`${dir}/${topic}.md`).write(`# ${topic}\n\n${article}`);
    });
}

function take1Sentence(list: string[]) {
    let positsion = Math.floor(Math.random() * list.length);
    return list[positsion];
}

function take1Number(min = 0, max = 100) {
    let num = Math.random() * (max - min) + min;
    return num;
}

function someFamousQuotes() {
    let famousQuotes = famousQuotesCN;
    let preWords = preWordsCN;
    let backWords = backWordsCN;

    const config = vscode.workspace.getConfiguration("bullshit");
    const language = config.get("language");
    switch (language) {
        case "CN":
            famousQuotes = famousQuotesCN;
            preWords = preWordsCN;
            backWords = backWordsCN;
            break;
        case "EN":
            famousQuotes = famousQuotesEN;
            preWords = preWordsEN;
            backWords = backWordsEN;
            break;
        default:
            famousQuotes = famousQuotesCN;
            preWords = preWordsCN;
            backWords = backWordsCN;
    }

    let saying = take1Sentence(famousQuotes)

    switch (language) {
        case "CN":
            saying = saying.replace("曾经说过", take1Sentence(preWords))
            saying = saying.replace("这不禁令我深思", take1Sentence(backWords))
            break;
        case "EN":
            saying = saying.replace("once said", take1Sentence(preWords))
            saying = saying.replace("This makes me think deeply", take1Sentence(backWords))
            break;
        default:
            saying = saying.replace("曾经说过", take1Sentence(preWords))
            saying = saying.replace("这不禁令我深思", take1Sentence(backWords))
    }

    return saying
}

function talkAbout(theme: string) {
    const config = vscode.workspace.getConfiguration("bullshit");
    const language = config.get("language");
    let discourse = discourseCN;
    switch (language) {
        case "CN":
            discourse = discourseCN;
            break;
        case "EN":
            discourse = discourseEN;
            break;
        default:
            discourse = discourseCN;
    }
    let sentence = take1Sentence(discourse);
    switch (language) {
        case "CN":
            sentence = sentence.replace(RegExp("主题", "g"), theme);
            break;
        case "EN":
            sentence = sentence.replace(RegExp("subject", "g"), theme);
            break;
        default:
            sentence = sentence.replace(RegExp("主题", "g"), theme);
    }
    return sentence;
}

function addParagraph(chapter: string) {
    const config = vscode.workspace.getConfiguration("bullshit");
    const language = config.get("language");
    if (chapter[chapter.length - 1] === " ") {
        chapter = chapter.slice(0, -2)
    }
    switch (language) {
        case "CN":
            return "　　" + chapter + "。 "
        case "EN":
            return "　　" + chapter + ". "
        default:
            return "　　" + chapter + "。 "
    }
}

function generateArticle(theme: any) {
    let article = []
    for (let i in theme) {
        let chapter = "";
        let chapterlength = 0;
        while (chapterlength < 6000) {
            let randomNumber = take1Number();
            if (randomNumber < 5 && chapter.length > 200) {
                chapter = addParagraph(chapter);
                article.push(chapter);
                chapter = "";
            } else if (randomNumber < 20) {
                let sentence = someFamousQuotes();
                chapterlength = chapterlength + sentence.length;
                chapter = chapter + sentence;
            } else {
                let sentence = talkAbout(theme);
                chapterlength = chapterlength + sentence.length;
                chapter = chapter + sentence;
            }
        }
        chapter = addParagraph(chapter);
        article.push(chapter);
    }
    let format = article.join("\n\n");
    return format;
}