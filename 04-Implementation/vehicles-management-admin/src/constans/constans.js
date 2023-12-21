export const fuelTypes = [
  { name: 'gasoline', value: 'gasoline' },
  { name: 'diesel', value: 'diesel' },
  {
    name: 'electric',
    value: 'electric'
  },
  { name: 'hybrid', value: 'hybrid' },
  { name: 'gas', value: 'gas' }
];
export const bodyTypes = [
  {
    name: 'Sedan',
    value: 'Sedan'
  },
  { name: 'Hatchback', value: 'Hatchback' },
  { name: 'SUV', value: 'SUV' },
  { name: 'Coupe', value: 'Coupe' },
  { name: 'Convertible', value: 'Convertible' },
  { name: 'Minivan', value: 'Minivan' },
  { name: 'Pickup', value: 'Pickup' },
  { name: 'Station Wagon', value: 'Station Wagon' },
  { name: 'Crossover', value: 'Crossover' }
];

export const transmissionTypes = [
  { name: 'Automatic', value: 'Automatic' },
  { name: 'Manual', value: 'Manual' },
  { name: 'CVT', value: 'CVT' },
  { name: 'Semi Automatic', value: 'Semi-Automatic' },
  { name: 'Dual Clutch', value: 'Dual-Clutch' },
  { name: 'Tiptronic', value: 'Tiptronic' },
  { name: 'Sportmatic', value: 'Sportmatic' },
  { name: 'AMT', value: 'AMT' },
  { name: 'DCT', value: 'DCT' },
  { name: 'eCVT', value: 'eCVT' }
];

export const languagesArr = [
  { name: 'English', value: 'en' },
  { name: 'Türkçe', value: 'tr' },
  { name: 'العربية', value: 'ar' }
];

export const REACT_APP_GOOGLE_API_KEY = 'AIzaSyB8jTUw8tRVknJ1Fd7TmVvpSxyhc5D4NDc';

export const defaultContent = localStorage.getItem('content')
  ? JSON.parse(localStorage.getItem('content'))
  : {
      _id: '********',
      adminTitle: 'ROM',
      adminLogo: '',
      appLogo: '',
      appTitle: 'ROM'
    };
