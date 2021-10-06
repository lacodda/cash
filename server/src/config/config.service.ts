const dotenv = require('dotenv');
const { join } = require('path');
const { readFileSync } = require('fs');

export class ConfigService {
  private readonly envConfig: Record<string, string>;
  constructor() {
    const result = dotenv.config({
      path: join(__dirname, `../../../.env.${process.env.NODE_ENV}`),
    });

    if (result.error) {
      this.envConfig = process.env;
    } else {
      this.envConfig = result.parsed;
    }
  }

  public get(key: string): string {
    return this.envConfig[key];
  }

  public getAppOptions() {
    return {
      httpsOptions: {
        key: readFileSync(join(__dirname, '../../../ssl/ssl.key')),
        cert: readFileSync(join(__dirname, '../../../ssl/ssl.crt')),
      },
    };
  }

  public async getPortConfig() {
    return this.get('SERVER_PORT');
  }

  public async getMongoConfig() {
    const user = this.get('MONGO_USER');
    const pass = this.get('MONGO_PASSWORD');
    const host = this.get('MONGO_HOST');
    const db = this.get('MONGO_DATABASE');
    let credentials = '';
    if (user && pass) {
      credentials = `${user}:${pass}@`;
    }
    return {
      uri: `mongodb://${credentials}${host}/${db}?retryWrites=true&w=majority`,
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    };
  }
}
