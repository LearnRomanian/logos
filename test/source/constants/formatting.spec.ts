import { describe, it } from "bun:test";
import {
	capitalise,
	code,
	codeMultiline,
	decapitalise,
	list,
	mention,
	timestamp,
	trim,
} from "logos:constants/formatting";
import { expect } from "chai";

describe("capitalise()", () => {
	it("turns the first letter of the passed string uppercase.", () => {
		expect(capitalise("hello world!")).to.equal("Hello world!");
	});

	it("returns an empty string when an empty string is inputted.", () => {
		expect(capitalise("")).to.equal("");
	});
});

describe("decapitalise()", () => {
	it("turns the first letter of the passed string lowercase.", () => {
		expect(decapitalise("Hello world!")).to.equal("hello world!");
	});

	it("returns an empty string when an empty string is inputted.", () => {
		expect(decapitalise("")).to.equal("");
	});
});

describe("code()", () => {
	it("throws when an empty string is passed.", () => {
		expect(() => code("")).to.throw("The string cannot be empty.");
	});

	it("wraps the passed string in a markdown code block.", () => {
		expect(code("this-is-a-sample-string")).to.equal("`this-is-a-sample-string`");
	});
});

describe("codeMultiline()", () => {
	it("wraps the passed string in a markdown multi-line code block.", () => {
		expect(codeMultiline("public static void main(String[] args) {}")).to.equal(
			"```public static void main(String[] args) {}```",
		);
	});

	it("returns a code block containing a newline when an empty string is inputted.", () => {
		expect(codeMultiline("")).to.equal("```\n```");
	});
});

describe("list()", () => {
	it("throws when an empty array is inputted.", () => {
		expect(() => list([])).to.throw("The array cannot be empty.");
	});

	it("formats the passed array of strings as a markdown list.", () => {
		expect(list(["one", "two", "three", "four"])).to.equal("- one\n- two\n- three\n- four");
	});
});

const TIMESTAMP = 7031;
const TIMESTAMP_MILLISECONDS = TIMESTAMP * 1000;

describe("timestamp()", () => {
	describe("formats the passed Unix timestamp", () => {
		it("in short time format.", () => {
			expect(timestamp(TIMESTAMP_MILLISECONDS, { format: "short-time" })).to.equal(`<t:${TIMESTAMP}:t>`);
		});

		it("in long time format.", () => {
			expect(timestamp(TIMESTAMP_MILLISECONDS, { format: "long-time" })).to.equal(`<t:${TIMESTAMP}:T>`);
		});

		it("in short date format.", () => {
			expect(timestamp(TIMESTAMP_MILLISECONDS, { format: "short-date" })).to.equal(`<t:${TIMESTAMP}:d>`);
		});

		it("in long date format.", () => {
			expect(timestamp(TIMESTAMP_MILLISECONDS, { format: "long-date" })).to.equal(`<t:${TIMESTAMP}:D>`);
		});

		it("in short date-time format.", () => {
			expect(timestamp(TIMESTAMP_MILLISECONDS, { format: "short-datetime" })).to.equal(`<t:${TIMESTAMP}:f>`);
		});

		it("in long date-time format.", () => {
			expect(timestamp(TIMESTAMP_MILLISECONDS, { format: "long-datetime" })).to.equal(`<t:${TIMESTAMP}:F>`);
		});

		it("in relative format.", () => {
			expect(timestamp(TIMESTAMP_MILLISECONDS, { format: "relative" })).to.equal(`<t:${TIMESTAMP}:R>`);
		});
	});
});

describe("mention()", () => {
	describe("formats the passed ID", () => {
		it("as a channel mention.", () => {
			expect(mention(7031n, { type: "channel" })).to.equal("<#7031>");
		});

		it("as a role mention.", () => {
			expect(mention(7031n, { type: "role" })).to.equal("<@&7031>");
		});

		it("as a user mention.", () => {
			expect(mention(7031n, { type: "user" })).to.equal("<@7031>");
		});
	});
});

const STRING = "This is a sample sentence.";

describe("trim()", () => {
	it("returns an empty string if an empty string was passed, regardless of the desired length.", () => {
		expect(trim("", 0)).to.equal("");
		expect(trim("", 3)).to.equal("");
		expect(trim("", 64)).to.equal("");
	});

	it("does not trim the string if it's shorter than or of the specified length.", () => {
		expect(trim(STRING, STRING.length + 1)).to.equal(STRING);
		expect(trim(STRING, STRING.length)).to.equal(STRING);
	});

	it("makes the passed string trail off if it's not composed of words.", () => {
		// Naive slice is 'qwertyuiopasdfghjklz'.
		expect(trim("qwertyuiopasdfghjklzxcvbnm", 20)).to.equal("qwertyuiopasdfghj...");
	});

	it("trims the passed sentence, replacing trimmed words with a continuation indicator.", () => {
		// Naive slice is 'This is a sample sentence that's too long to be di'.
		expect(trim("This is a sample sentence that's too long to be displayed in full.", 50)).to.equal(
			"This is a sample sentence that's too long to (...)",
		);
	});

	it("trims trailing whitespace before replacing the ending with a continuation indicator.", () => {
		// Naive slice is 'This is a sample              '.
		expect(trim("This is a sample                   sentence.", 30)).to.equal("This is a sample (...)");
	});
});
