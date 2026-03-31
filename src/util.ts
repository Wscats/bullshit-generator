import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { discourseCN, famousQuotesCN, backWordsCN, preWordsCN } from "./template.cn";
import { discourseEN, famousQuotesEN, backWordsEN, preWordsEN } from "./template.en";

/** Supported languages for bullshit generation. */
type Language = "CN" | "EN";

/** Language-specific template sets. */
interface TemplateSet {
  discourse: string[];
  famousQuotes: string[];
  preWords: string[];
  backWords: string[];
  topicPlaceholder: string;
  onceSaid: string;
  thinkDeeply: string;
  periodMark: string;
}

/** Template sets indexed by language. */
const TEMPLATES: Record<Language, TemplateSet> = {
  CN: {
    discourse: discourseCN,
    famousQuotes: famousQuotesCN,
    preWords: preWordsCN,
    backWords: backWordsCN,
    topicPlaceholder: "主题",
    onceSaid: "曾经说过",
    thinkDeeply: "这不禁令我深思",
    periodMark: "。 ",
  },
  EN: {
    discourse: discourseEN,
    famousQuotes: famousQuotesEN,
    preWords: preWordsEN,
    backWords: backWordsEN,
    topicPlaceholder: "subject",
    onceSaid: "once said",
    thinkDeeply: "This makes me think deeply",
    periodMark: ". ",
  },
};

/** Get the configured language, defaulting to CN. */
function getLanguage(): Language {
  const config = vscode.workspace.getConfiguration("bullshit");
  const lang = config.get<string>("language");
  return lang === "EN" ? "EN" : "CN";
}

/** Get the template set for the current language. */
function getTemplates(): TemplateSet {
  return TEMPLATES[getLanguage()];
}

/** Find the directory containing a file path. */
function findDir(filePath: string): string {
  if (fs.statSync(filePath).isFile()) {
    return path.dirname(filePath);
  }
  return filePath;
}

/** Recursively create a directory if it doesn't exist. */
function makeDirSync(dir: string): void {
  if (fs.existsSync(dir)) {
    return;
  }
  if (!fs.existsSync(path.dirname(dir))) {
    makeDirSync(path.dirname(dir));
  }
  fs.mkdirSync(dir);
}

/** Pick a random element from an array. */
function pickRandom<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

/** Generate a random number in [min, max). */
function randomNumber(min = 0, max = 100): number {
  return Math.random() * (max - min) + min;
}

/** Generate a famous quote with randomized pre/back words. */
function generateFamousQuote(): string {
  const t = getTemplates();
  let quote = pickRandom(t.famousQuotes);
  quote = quote.replace(t.onceSaid, pickRandom(t.preWords));
  quote = quote.replace(t.thinkDeeply, pickRandom(t.backWords));
  return quote;
}

/** Generate a discourse sentence about the given theme. */
function generateDiscourse(theme: string): string {
  const t = getTemplates();
  let sentence = pickRandom(t.discourse);
  sentence = sentence.replace(new RegExp(t.topicPlaceholder, "g"), theme);
  return sentence;
}

/** Wrap a chapter text with paragraph indentation and period. */
function formatParagraph(chapter: string): string {
  const t = getTemplates();
  const trimmed = chapter.trimEnd();
  return `　　${trimmed}${t.periodMark}`;
}

/** Generate a full bullshit article about the given theme. */
function generateArticle(theme: string): string {
  const paragraphs: string[] = [];

  for (const _char of theme) {
    let chapter = "";
    let chapterLength = 0;

    while (chapterLength < 6000) {
      const roll = randomNumber();

      if (roll < 5 && chapter.length > 200) {
        paragraphs.push(formatParagraph(chapter));
        chapter = "";
      } else if (roll < 20) {
        const sentence = generateFamousQuote();
        chapterLength += sentence.length;
        chapter += sentence;
      } else {
        const sentence = generateDiscourse(theme);
        chapterLength += sentence.length;
        chapter += sentence;
      }
    }

    paragraphs.push(formatParagraph(chapter));
  }

  return paragraphs.join("\n\n");
}

/** VSCode command handler: prompt for topic and generate bullshit article. */
export const generateBullShit = (file: { fsPath: string }) => {
  vscode.window
    .showInputBox({
      value: "",
      prompt: "topic",
      ignoreFocusOut: true,
      valueSelection: [-1, -1],
    })
    .then((name: string | undefined) => {
      if (!name) {
        return;
      }
      const topic = name.charAt(0).toUpperCase() + name.slice(1);
      const dir = findDir(file.fsPath);
      const article = generateArticle(topic);
      fs.createWriteStream(`${dir}/${topic}.md`).write(
        `# ${topic}\n\n${article}`,
      );
    });
};