export default function series(db) {
  const index = (req, res) => {
    db.Series.findAll()
      .then((series) => {
        res.render();
      });
  };
}
