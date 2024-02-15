import {MigrationInterface, QueryRunner} from "typeorm";

export class SignupNote1708009997193 implements MigrationInterface{
	name = "SignupNote1708009997193";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "user" ADD "signupNote" character varying(1024) DEFAULT NULL`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "user" DROP COLUMN "signupNote"`,
		);
	}
}