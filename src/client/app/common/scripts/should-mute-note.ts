export default function(me, settings, note) {
	const isMyNote = me && (note.userId == me.id);
	const isPureRenote = note.renoteId != null && note.text == null && note.fileIds.length == 0 && note.poll == null;

	const includesMutedWords = (text: string) =>
		text
			? settings.mutedWords.some(q => q.length > 0 && !q.some(word =>
				word.startsWith('/') && word.endsWith('/') ? !(new RegExp(word.substr(1, word.length - 2)).test(text)) : !text.includes(word)))
			: false;
	const includesMutedLangs = (text: string) =>
		text
			? settings.mutedLangs.some(q => q.length > 0 && !q.some(word =>
				word.startsWith('/') && word.endsWith('/') ? !(new RegExp(word.substr(1, word.length - 2)).test(text)) : !text.includes(word)))
			: false;
	let isIncludesMutedLangs = false;
	if(note.lang)
		if(note.lang[0])
			isIncludesMutedLangs = includesMutedLangs(note.lang[0].lang);
	return (
		(!isMyNote && note.reply && includesMutedWords(note.reply.text)) ||
		(!isMyNote && note.renote && includesMutedWords(note.renote.text)) ||
		(!settings.showMyRenotes && isMyNote && isPureRenote) ||
		(!settings.showRenotedMyNotes && isPureRenote && note.renote.userId == me.id) ||
		(!settings.showLocalRenotes && isPureRenote && note.renote.user.host == null) ||
		(!isMyNote && includesMutedWords(note.text)) ||
		(!isMyNote && isIncludesMutedLangs)
	);
}
