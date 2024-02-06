import { Notes, DriveFiles } from "../models";

export async function setLocalInteraction( noteid: string ) {
	const note = await Notes.findOneBy({ id: noteid });
	
	await Notes.update(noteid, {localInteraction: true});

	for (const fileid of note.fileIds) {
		await DriveFiles.update(fileid, {localInteraction: true});
	}

	if(note.replyId != null){
		setLocalInteraction(note.replyId);
	}

	if(note.renoteId != null){
		setLocalInteraction(note.replyId);
	}
}
