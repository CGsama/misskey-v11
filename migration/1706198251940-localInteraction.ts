import {MigrationInterface, QueryRunner} from "typeorm";

export class LocalInteraction1706198251940 implements MigrationInterface{
	name = "LocalInteraction1706198251940";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "drive_file" ADD "localInteraction" boolean NOT NULL DEFAULT FALSE`,
		);
		await queryRunner.query(
			`ALTER TABLE "note" ADD "localInteraction" boolean NOT NULL DEFAULT FALSE`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "drive_file" DROP COLUMN "localInteraction"`,
		);
		await queryRunner.query(
			`ALTER TABLE "note" DROP COLUMN "localInteraction"`,
		);
	}
}


/*

do $$
	declare prev integer := 0;
	declare curr integer := 0;
begin

	select count(*) into curr from public.note where "localInteraction" = true;
	raise notice 'Init with local interaction count %', curr;
	
	update public.note set "localInteraction" = true where "userHost" isNull;

	update public.note
	set "localInteraction" = true
	where exists(
		select * from public.poll_vote, public.user
		where
			public.poll_vote."noteId" = public.note.id
			and public.poll_vote."userId" = public.user.id
			and public.user.host isNull
	);

	update public.note
	set "localInteraction" = true
	where exists(
		select * from public.note_favorite, public.user
		where
			public.note_favorite."noteId" = public.note.id
			and public.note_favorite."userId" = public.user.id
			and public.user.host isNull
	);

	update public.note as parent
	set "localInteraction" = true
	from (
		select distinct public.note_reaction."noteId"
		from public.note_reaction, public.user
		where
			public.note_reaction."userId" = public.user.id
			and public.user.host isNull
	) as child
	where child."noteId" = parent.id;

	select count(*) into curr from public.note where "localInteraction" = true;
	
	raise notice 'Finish child notes with local interaction count %', curr;
	
	while prev < curr loop
		prev := curr;
		
		update public.note as parent
		set "localInteraction" = true
		from (
			select distinct "replyId", "renoteId" from public.note where "localInteraction" = true and not ("replyId" isNull and "renoteId" isNull)
		) as child
		where (child."replyId" = parent.id or child."renoteId" = parent.id) and "localInteraction" = false;
		
		select count(*) into curr from public.note where "localInteraction" = true;
		raise notice 'Local interaction count %', curr;
		
	end loop;
	
	select count(*) into curr from public.note where "localInteraction" = true;
	
	raise notice 'Finish rebuild local interaction on notes with count %', curr;
	
	select count(*) into curr from public."drive_file" where "localInteraction" = true;
	
	raise notice 'Start rebuild local interaction on files with count %', curr;
	
	update public.drive_file
	set "localInteraction" = true
	from (
		select distinct unnest(public.note."fileIds") as id
		from public.note
		where public.note."localInteraction" = true
	) as innote
	where public.drive_file.id = innote.id;
	
	select count(*) into curr from public."drive_file" where "localInteraction" = true;
	
	raise notice 'Finish rebuild local interaction on files with count %', curr;

end$$;

*/ 