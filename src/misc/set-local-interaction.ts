import { Notes, DriveFiles } from "../models";

export async function setLocalInteraction( noteid: string ) {
	const note = await Notes.findOne(noteid);

    await Notes.update({id: noteid}, {localInteraction: true});

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
