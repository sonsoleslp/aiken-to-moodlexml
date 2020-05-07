/* eslint-disable */
const moodleString = (questions, options = {}) => { console.log(options);
	return `<?xml version="1.0" encoding="UTF-8"?>
<quiz>
${questions.map((q,i)=>{
	return question(i, q, options.shuffle);
}).join("\n")}
</quiz>`};

const category = (category) => {
	return `	<question type="category">
		<category>
			<text>${category}</text>
		</category>
	</question>
`;
}

const categoryHierarchy = (categories) => {
	const defCats = ["$course$/top"].concat(categories);
	return defCats.map((c,i)=>category(defCats.slice(0,i+1).join("/"))).join("");
}

const question = (index, {type, question, categories, answers, correctAnswer, fractions, useLetters, feedback, single}, shuffle) => { 
	if (type === "category"){
		return categoryHierarchy(categories);
	}
	return `	<!-- Question entry ${index} -->
	<question type="${type}">
		<name>
			<text><![CDATA[${question}]]></text>
		</name>
		<questiontext format="html">
			<text><![CDATA[${question}]]></text>
		</questiontext>
		${questionType(type, question, answers, correctAnswer, fractions, useLetters, feedback, single, shuffle)}${feedback ? `\n\t\t<generalfeedback><text>${feedback}</text></generalfeedback>` : ``}
	</question>
`.replace('\n\t*\n', '');
}

const questionType = (type, question, answers, correctAnswer, fractions, useLetters, feedback, single, shuffle) => {
	if (type === 'matching' || type === "order"){
		return `${(answers || []).map((a,i) => {
			return `<subquestion>
			<text><![CDATA[${a}]]></text>
			${correctAnswer && correctAnswer.length ? (`<answer format="html">
				<text><![CDATA[${correctAnswer[i]}]]></text>
			</answer>
				`) : '\n'}
			</subquestion>
			${shuffle ? "<shuffleanswers>true</shuffleanswers>":""}
			`
	}).join("")}`;

	} else {
		return `${(answers||[]).map((a,i) => {
			const fraction = (correctAnswer || []).indexOf(i) === -1 ? "0" : "100";
				return `<answer format="html" fraction="${(fractions && fractions[i] !== undefined) ? fractions[i] : fraction}">
				<text><![CDATA[${a}]]></text>
		</answer>
		`;
	}).join("")}${single ?  `\n\t\t<single>true</single>` : ''}${useLetters === false ? `\n\t\t<answernumbering>123</answernumbering>` : ''}${shuffle ? `\n\t\t<shuffleanswers>true</shuffleanswers>` : ''}`;
	}
	
};
export default moodleString;