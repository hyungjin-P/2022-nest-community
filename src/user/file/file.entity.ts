import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class File {
  @PrimaryColumn()
  bucket: string;

  @PrimaryColumn()
  key: string;

  @Column()
  userId: string;

  @Column()
  url: string;

  @Column()
  originalname: string;

  @Column()
  encoding: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @Column()
  acl: string;

  @Column()
  contentType: string;

  @Column()
  contentDisposition: string;

  @Column()
  storageClass: string;

  @Column()
  serverSideEncryption: string;

  @Column()
  metadata: string;

  @Column()
  location: string;

  @Column()
  etag: string;

  @Column()
  versionId: string;

  @CreateDateColumn()
  createAt: Date;
}
