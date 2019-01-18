/* eslint-disable */
const moodleString = (questions) => { return `<?xml version="1.0" encoding="UTF-8"?>
<quiz>
	<question type="category">
		<category>
		  <text>__Category Name__</text>
		</category>
	</question>
${questions.map((q,i)=>{
	return question(i,q);
}).join("\n")}
</quiz>`};


const question = (index,{type, question, answers, correctAnswer, useLetters, feedback, single}) => { return `	<!-- Question entry ${index} -->
	<question type="${type}">
		<name>
		    <text><![CDATA[${question}]]></text>
		</name>
		<questiontext>
		    <text><![CDATA[${question}]]></text>
		</questiontext>
		${questionType(type, question, answers, correctAnswer, useLetters, feedback, single)}
		${feedback ? `<generalfeedback><text>${feedback}</text></generalfeedback>` : ``}
	</question>
`.replace('\n\t*\n', '');
}

const questionType = (type, question, answers, correctAnswer, useLetters, feedback, single) => {
	console.log(type, question, answers, correctAnswer, useLetters, feedback, single)
	if (type === 'matching' || type === "order"){
		return `${(answers||[]).map((a,i) => {
		return `<subquestion>
			<text><![CDATA[${a}]]></text>
			<answer>
		        <text><![CDATA[${correctAnswer[i]}]]></text>
		    </answer>
		</subquestion>`
	}).join("")}`;

	} else {
		return `${(answers||[]).map((a,i) => {
		const fraction = (correctAnswer || []).indexOf(i) === -1 ? "0" : "100";
		return `
		<answer fraction="${fraction}">
    		<text><![CDATA[${a}]]></text>
		</answer>`;
	}).join("")}
${single ?  `			<single>true</single>` : ``}
${useLetters === false ? `		<answernumbering>123</answernumbering>` : ``}	`;
	}
	
};
export default moodleString;