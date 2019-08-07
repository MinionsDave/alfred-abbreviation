const alfy = require('alfy');
const { load } = require('cheerio');
const alfredNotifier = require('alfred-notifier');

alfredNotifier();

function getPointEmoji(point) {
	return {
		0: '😷',
		1: '🙁',
		2: '😕',
		3: '😐',
		4: '😉',
		5: '😊',
	}[point] || '';
}

(async () => {
	const url = `https://www.abbreviations.com/abbreviation/${alfy.input}`;
	const data = await alfy.fetch(url, {
		json: false,
	});
	const $ = load(data);

	const items = $('.table.tdata.no-margin tr')
		.map((_, ele) => {
			const $ele = $(ele);
			const abbr = $ele.find('td:nth-child(1) a').text();
			const point = $ele.find('td:last-child span.sf').length;;
			return {
				point,
				title: `${getPointEmoji(point)} ${abbr}`,
				subtitle: $(ele)
					.find('td:nth-child(2) a')
					.map((_, e) => $(e).text()).get().join(' / '),
				arg: abbr,
				quicklookurl: url,
				text: {
					copy: abbr,
					largetype: abbr,
				}
			}
		})
		.get()
		.sort((item1, item2) => item2.point - item1.point);

	alfy.output(items);
})()
