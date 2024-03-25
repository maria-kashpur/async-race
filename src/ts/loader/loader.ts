import {
  CarParam,
  Engine,
  Drive,
  WinnerData,
  GetWinnersParam,
  StatusDrive,
  Request,
} from '../types/types';

class Loader {
  static server = 'http://127.0.0.1:3000/';

  static async getCars(): Promise<CarParam[]> {
    const res = await Loader.load(`${this.server}garage/`, Request.get);
    return res.json();
  }

  static async getCarsPagination(page: number, limit = 7) {
    const url = `${this.server}garage/?${new URLSearchParams({
      _page: `${page}`,
      _limit: `${limit}`,
    })}`;
    const res = await Loader.load(url, Request.get);
    const cars: CarParam[] = await res.json();
    const carsAmount: string | null = res.headers.get('X-Total-Count');
    return { cars, carsAmount };
  }

  static async getCar(id = 1): Promise<CarParam> {
    const res = await Loader.load(`${this.server}garage/${id}/`, Request.get);
    return res.json();
  }

  static async createCar(params: Omit<CarParam, 'id'>): Promise<CarParam> {
    const res = await Loader.load(`${this.server}garage/`, Request.post, params);
    return res.json();
  }

  static async deleteCar(num = 1): Promise<Response> {
    const res = await Loader.load(`${this.server}garage/${num}/`, Request.del);
    return res;
  }

  static async updateCar(
    params: Omit<CarParam, 'id'>,
    num = 1,
  ): Promise<CarParam> {
    const res = await Loader.load(
      `${this.server}garage/${num}/`,
      Request.put,
      params,
    );
    return res.json();
  }

  static async drive(id: number, status: StatusDrive): Promise<Drive | Engine> {
    const url = `${this.server}engine/?${new URLSearchParams({
      id: `${id}`,
      status: `${status}`,
    })}`;
    const res = await Loader.load(url, Request.patch);
    return res.json();
  }

  static async getWinners(): Promise<WinnerData[]> {
    const res = await Loader.load(`${this.server}winners/`, Request.get);
    return res.json();
  }

  static async getWinnersPagination(params: GetWinnersParam) {
    let paramsURL = '';
    if (arguments.length > 0) {
      paramsURL += `${Object.entries(params)
        .reduce((acc: string[], el) => {
          acc.push(`_${el[0]}=${el[1]}`);
          return acc;
        }, [])
        .join('&')}`;
    }
    const url = `${this.server}winners/?${paramsURL}`;
    const res = await Loader.load(url, Request.get);
    const winners: WinnerData[] = await res.json();
    const winnersAmount = Number(res.headers.get('X-Total-Count'));
    return { winners, winnersAmount };
  }

  static async getWinner(num = 1): Promise<WinnerData> {
    const res = await Loader.load(`${this.server}winners/${num}/`, Request.get);
    return res.json();
  }

  static async createWinner(params: WinnerData): Promise<WinnerData> {
    const res = await Loader.load(`${this.server}winners/`, Request.post, params);
    return res.json();
  }

  static async deleteWinner(num = 1): Promise<void> {
    const res = await Loader.load(`${this.server}winners/${num}/`, Request.del);
    return res.json();
  }

  static async updateWinner(
    params: Omit<WinnerData, 'id'>,
    num = 1,
  ): Promise<WinnerData> {
    const res = await Loader.load(
      `${this.server}winners/${num}/`,
      Request.put,
      params,
    );
    return res.json();
  }

  static async load(
    url: string,
    method: Request,
    params?: object,
  ): Promise<Response> {
    return fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      method,
      body: params ? JSON.stringify(params) : undefined,
    }).then((res: Response) => {
      if (!res.ok) {
        throw Error(res.status.toString());
      }
      return res;
    });
  }
}
export default Loader;
