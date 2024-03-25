import getRandomNum from './getRandomNum';
import getRandomColor from './getRandomColor';
import { CarParam } from '../types/types';
import cars from '../components/garage/car/carBrands';

export default function generateCarParam(): Omit<CarParam, 'id'> {
  const brand = cars[getRandomNum(0, cars.length)];
  const model = brand[1][getRandomNum(0, brand.length)];

  return { name: `${brand[0]} ${model}`, color: getRandomColor() };
}
