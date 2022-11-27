import { useState } from 'react';
import classNames from 'classnames';
import { CaretRight } from 'phosphor-react';

import styles from './Faq.module.css';

export default function Faq(ctx) {
	const { questionObject } = ctx;
	const [selectedIndex, setSelectedIndex] = useState(0);

	const questions = {
		odd: questionObject.filter((_, i) => i % 2 === 0),
		even: questionObject.filter((_, i) => i % 2 !== 0),
	};

	// reusable question component
	const QnA = ({ question, i, selected }) => (
		<div className={styles.question}>
			<h3 className={classNames({ [styles.selected]: selected })} onClick={() => setSelectedIndex(i)}>
				<CaretRight size={24} weight="bold" className={styles.chevron} />
				{question.question}
			</h3>
			<p style={{ display: selected ? 'block' : 'none' }} dangerouslySetInnerHTML={{ __html: question.answer }} />
		</div>
	);

	return (
		<div className={styles.faq}>
			<div>
				{questions.odd.map((question, i) => {
					const selected = selectedIndex === i;
					return <QnA key={i} question={question} selected={selected} i={i} />;
				})}
			</div>
			<div>
				{questions.even.map((question, i) => {
					const index = i + questions.odd.length;
					const selected = selectedIndex === index;
					return <QnA key={i} question={question} selected={selected} i={index} />;
				})}
			</div>
		</div>
	);
}
