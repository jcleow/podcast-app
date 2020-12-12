
--Insert Genre Seed Queries
INSERT INTO genres (name) VALUES('Arts');
INSERT INTO subgenres(name,genre_id) VALUES('Books',1);
INSERT INTO subgenres(name,genre_id) VALUES('Design',1);
INSERT INTO subgenres(name,genre_id) VALUES('Fashion & Beauty',1);
INSERT INTO subgenres(name,genre_id) VALUES('Other',1);


INSERT INTO genres (name) VALUES('Business');
INSERT INTO subgenres(name,genre_id) VALUES('Careers',2);
INSERT INTO subgenres(name,genre_id) VALUES('Entrepreneurship',2);
INSERT INTO subgenres(name,genre_id) VALUES('Investing',2);
INSERT INTO subgenres(name,genre_id) VALUES('Other',2);


INSERT INTO genres (name) VALUES('Comedy');
INSERT INTO subgenres(name,genre_id) VALUES('Interviews',3);
INSERT INTO subgenres(name,genre_id) VALUES('Improv & Stand Up',3);
INSERT INTO subgenres(name,genre_id) VALUES('Other',3);


INSERT INTO genres (name) VALUES('Education');
INSERT INTO subgenres(name,genre_id) VALUES('Courses',4);
INSERT INTO subgenres(name,genre_id) VALUES('Self-Improvement',4);
INSERT INTO subgenres(name,genre_id) VALUES('Other',4);


INSERT INTO genres (name) VALUES('Fiction');
INSERT INTO subgenres(name,genre_id) VALUES('Comedy Fiction',5);
INSERT INTO subgenres(name,genre_id) VALUES('Drama',5);
INSERT INTO subgenres(name,genre_id) VALUES('Science Fiction',5);
INSERT INTO subgenres(name,genre_id) VALUES('Other',5);


INSERT INTO genres (name) VALUES('Government');
INSERT INTO subgenres(name,genre_id) VALUES('Other',6);
--no subcategories, genre_id = 6


INSERT INTO genres (name) VALUES('Health & Fitness');
INSERT INTO subgenres(name,genre_id) VALUES('Alternative Health',7);
INSERT INTO subgenres(name,genre_id) VALUES('Medicine',7);
INSERT INTO subgenres(name,genre_id) VALUES('Mental Health',7);
INSERT INTO subgenres(name,genre_id) VALUES('Other',7);


INSERT INTO genres (name) VALUES('History');
INSERT INTO subgenres(name,genre_id) VALUES('Other',8);
--no subcategories, genre_id = 8


INSERT INTO genres (name) VALUES('Kids & Family');
INSERT INTO subgenres(name,genre_id) VALUES('Education for Kids',9);
INSERT INTO subgenres(name,genre_id) VALUES('Parenting',9);
INSERT INTO subgenres(name,genre_id) VALUES('Pets & Animals',9);
INSERT INTO subgenres(name,genre_id) VALUES('Stories for Kids',9);
INSERT INTO subgenres(name,genre_id) VALUES('Other',9);

INSERT INTO genres (name) VALUES('Leisure');
INSERT INTO subgenres(name,genre_id) VALUES('Animation & Manga',10);
INSERT INTO subgenres(name,genre_id) VALUES('Automotive',10);
INSERT INTO subgenres(name,genre_id) VALUES('Games',10);
INSERT INTO subgenres(name,genre_id) VALUES('Other',10);


INSERT INTO genres (name) VALUES('Music');
INSERT INTO subgenres(name,genre_id) VALUES('Music Commentary',11);
INSERT INTO subgenres(name,genre_id) VALUES('Music History',11);
INSERT INTO subgenres(name,genre_id) VALUES('Music Interviews',11);
INSERT INTO subgenres(name,genre_id) VALUES('Other',11);


INSERT INTO genres (name) VALUES('News');
INSERT INTO subgenres(name,genre_id) VALUES('Business News',12);
INSERT INTO subgenres(name,genre_id) VALUES('Daily News',12);
INSERT INTO subgenres(name,genre_id) VALUES('Tech News',12);
INSERT INTO subgenres(name,genre_id) VALUES('Other',12);


INSERT INTO genres (name) VALUES('Religion & Spirituality');
INSERT INTO subgenres(name,genre_id) VALUES('Other',13);
--no subcategories genre_id = 13

INSERT INTO genres (name) VALUES('Science');
INSERT INTO subgenres(name,genre_id) VALUES('Astronomy',14);
INSERT INTO subgenres(name,genre_id) VALUES('Chemistry',14);
INSERT INTO subgenres(name,genre_id) VALUES('Mathematics',14);
INSERT INTO subgenres(name,genre_id) VALUES('Other',14);


INSERT INTO genres (name) VALUES('Society & Culture');
INSERT INTO subgenres(name,genre_id) VALUES('Documentary',15);
INSERT INTO subgenres(name,genre_id) VALUES('Philosophy',15);
INSERT INTO subgenres(name,genre_id) VALUES('Relationships',15);
INSERT INTO subgenres(name,genre_id) VALUES('Other',15);


INSERT INTO genres (name) VALUES('Sports');
INSERT INTO subgenres(name,genre_id) VALUES('Baseball',16);
INSERT INTO subgenres(name,genre_id) VALUES('Basketball',16);
INSERT INTO subgenres(name,genre_id) VALUES('Cricket',16);
INSERT INTO subgenres(name,genre_id) VALUES('Other',16);

INSERT INTO genres (name) VALUES('Technology');
INSERT INTO subgenres(name,genre_id) VALUES('Other',17);
--no subcategories genre_id = 17;

INSERT INTO genres (name) VALUES('True Crime');
INSERT INTO subgenres(name,genre_id) VALUES('Other',18);
--no subcategories genre_id = 18;

INSERT INTO genres (name) VALUES('TV & Film');
INSERT INTO subgenres(name,genre_id) VALUES('Shows',19);
INSERT INTO subgenres(name,genre_id) VALUES('Film History',19);
INSERT INTO subgenres(name,genre_id) VALUES('Film Interviews',19);
INSERT INTO subgenres(name,genre_id) VALUES('Other',19);