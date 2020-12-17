import db from './models/index.mjs';
import items from './controllers/items.mjs';

export default function routes(app) {
  const ItemsController = items(db);
}
