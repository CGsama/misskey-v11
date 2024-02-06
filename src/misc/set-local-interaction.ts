import { Notes, DriveFiles } from "../models";
import { apiLogger } from '../services/logger';

export async function setLocalInteraction( noteid: string ) {
	const note = await Notes.findOneBy({ id: noteid });

    apiLogger.info(`set local interaction for note: ${noteid}`);
	
	await Notes.update({id: noteid}, {localInteraction: true});

	for (const fileid of note.fileIds) {
        apiLogger.info(`set local interaction for file: ${fileid}`);
		await DriveFiles.update({id: fileid}, {localInteraction: true});
	}

	if(note.replyId != null){
		setLocalInteraction(note.replyId);
	}

	if(note.renoteId != null){
		setLocalInteraction(note.replyId);
	}
}
