import jsSHA from 'jssha';
import db from '../models/index.mjs';

export default function login() {
  const index = async (req, res) => {
    res.render('logins/newLoginForm');
  };

  const create = async (req, res) => {
    // Convert req.body.password to hashed password first
    const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
    shaObj.update(req.body.password);
    const hash = shaObj.getHash('HEX');

    const selectedUser = await db.User.findAll({
      where: {
        password: hash,
      },
    });
    console.log(selectedUser);
  };
  return { index, create };
}
