interface mySQL {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export const mySQLProperties = {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3000,
  username: 'root',
  password: 'example',
  database: 'nest-events',
};
