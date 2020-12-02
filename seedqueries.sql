INSERT INTO podcast_episodes(name,description,episode_number,podcast_ext_url) 
VALUES (
  'Freakonomics Radio - How Can Tiny Norway Afford to Buy So Many Teslas?',
  'How??',
  100,
  'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/240463699&color=%23310b09&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true'
);

INSERT INTO podcast_episodes(name,description,episode_number,podcast_ext_url) 
VALUES (
  'Freakonomics Radio - Peter Leeson Interviewed at Freakonomics Radio about Trials by Ordeal',
  'How??',
  101,
  'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/185071313&color=%23310b09&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true'
);

INSERT INTO podcast_episodes(name,description,episode_number,podcast_ext_url) 
VALUES (
  'Ulrich Volz: Pandemic is but a Prelude to Looming Climate Crisis',
  'Despite long-standing warnings from scientists about the risks of a pandemic, the world was simply unprepared for this one. Ulrich Volz says the same is true for climate change. Volz is the director of the Center for Sustainable Finance at SOAS University of London and in this podcast, he says many countries will find themselves in a permanent crisis mode unless concerted efforts are made to strengthen investment to mitigate and adapt to climate change, Volzs article Investing in a Green Recovery is published in the June 2020 issue of Finance and Development Magazine.
',
  0,
  'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/928164712&color=%23310b09&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true'
);

INSERT INTO podcast_episodes(name,description,episode_number,podcast_ext_url) 
VALUES (
  'Michael Kremer: Investing in Vaccines Now Would Buy Time, Save $Billions',
  'In the early 2000s, Nobel Laureate, Michael Kremer helped develop the design of advance market commitment models (AMCs). They were used to incentivize the private sector to work on issues of relevance for the developing world by pledging that if they developed an appropriate vaccine, funds would be available for those countries to purchase it. The approach resulted in billions of dollars being devoted to pneumococcal vaccines for strains common in developing countries, saving hundreds of thousands of lives. Kremer''s latest research focuses on how to expedite the production and distribution of the COVID-19 vaccines immediately following successful medical trials. In this podcast, Kremer says at-risk investment into vaccine manufacturing capacity before clinical approval would advance vaccine distribution by 6 months or more. Michael Kremer is Professor in Economics at the University of Chicago and director of the Development Innovation Lab. He shared the Nobel Memorial Prize in Economics in 2019 for his work on experimental approaches to alleviating global poverty. He was invited by the Institute for Capacity Development to present his latest research to IMF economists. Check out the University of Chicago''s podcast
',
  0,
  'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/914946415&color=%23310b09&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true'
);


--Insert Genre Seed Queries
INSERT INTO genres (name) VALUES('Arts');
INSERT INTO subgenres(name,genre_id) VALUES('Books',1);
INSERT INTO subgenres(name,genre_id) VALUES('Design',1);
INSERT INTO subgenres(name,genre_id) VALUES('Fashion & Beauty',1);


INSERT INTO genres (name) VALUES('Business');
INSERT INTO subgenres(name,genre_id) VALUES('Careers',2);
INSERT INTO subgenres(name,genre_id) VALUES('Entrepreneurship',2);
INSERT INTO subgenres(name,genre_id) VALUES('Investing',2);


INSERT INTO genres (name) VALUES('Comedy');
INSERT INTO subgenres(name,genre_id) VALUES('Interviews',3);
INSERT INTO subgenres(name,genre_id) VALUES('Improv & Stand Up',3);


INSERT INTO genres (name) VALUES('Education');
INSERT INTO subgenres(name,genre_id) VALUES('Courses',4);
INSERT INTO subgenres(name,genre_id) VALUES('Self-Improvement',4);


INSERT INTO genres (name) VALUES('Fiction');
INSERT INTO subgenres(name,genre_id) VALUES('Comedy Fiction',5);
INSERT INTO subgenres(name,genre_id) VALUES('Drama',5);
INSERT INTO subgenres(name,genre_id) VALUES('Science Fiction',5);


INSERT INTO genres (name) VALUES('Government');
--no subcategories, genre_id = 6


INSERT INTO genres (name) VALUES('Health & Fitness');
INSERT INTO subgenres(name,genre_id) VALUES('Alternative Health',7);
INSERT INTO subgenres(name,genre_id) VALUES('Medicine',7);
INSERT INTO subgenres(name,genre_id) VALUES('Mental Health',7);


INSERT INTO genres (name) VALUES('History');
--no subcategories, genre_id = 8


INSERT INTO genres (name) VALUES('Kids & Family');
INSERT INTO subgenres(name,genre_id) VALUES('Education for Kids',9);
INSERT INTO subgenres(name,genre_id) VALUES('Parenting',9);
INSERT INTO subgenres(name,genre_id) VALUES('Pets & Animals',9);
INSERT INTO subgenres(name,genre_id) VALUES('Stories for Kids',9);

INSERT INTO genres (name) VALUES('Leisure');
INSERT INTO subgenres(name,genre_id) VALUES('Animation & Manga',10);
INSERT INTO subgenres(name,genre_id) VALUES('Automotive',10);
INSERT INTO subgenres(name,genre_id) VALUES('Games',10);


INSERT INTO genres (name) VALUES('Music');
INSERT INTO subgenres(name,genre_id) VALUES('Music Commentary',11);
INSERT INTO subgenres(name,genre_id) VALUES('Music History',11);
INSERT INTO subgenres(name,genre_id) VALUES('Music Interviews',11);


INSERT INTO genres (name) VALUES('News');
INSERT INTO subgenres(name,genre_id) VALUES('Business News',12);
INSERT INTO subgenres(name,genre_id) VALUES('Daily News',12);
INSERT INTO subgenres(name,genre_id) VALUES('Tech News',12);


INSERT INTO genres (name) VALUES('Religion & Spirituality');
--no subcategories genre_id = 13

INSERT INTO genres (name) VALUES('Science');
INSERT INTO subgenres(name,genre_id) VALUES('Astronomy',14);
INSERT INTO subgenres(name,genre_id) VALUES('Chemistry',14);
INSERT INTO subgenres(name,genre_id) VALUES('Mathematics',14);


INSERT INTO genres (name) VALUES('Society & Culture');
INSERT INTO subgenres(name,genre_id) VALUES('Documentary',15);
INSERT INTO subgenres(name,genre_id) VALUES('Philosophy',15);
INSERT INTO subgenres(name,genre_id) VALUES('Relationships',15);


INSERT INTO genres (name) VALUES('Sports');
INSERT INTO subgenres(name,genre_id) VALUES('Baseball',16);
INSERT INTO subgenres(name,genre_id) VALUES('Basketball',16);
INSERT INTO subgenres(name,genre_id) VALUES('Cricket',16);

INSERT INTO genres (name) VALUES('Technology');
--no subcategories genre_id = 17;

INSERT INTO genres (name) VALUES('True Crime');
--no subcategories genre_id = 18;

INSERT INTO genres (name) VALUES('TV & Film');
INSERT INTO subgenres(name,genre_id) VALUES('Shows',19);
INSERT INTO subgenres(name,genre_id) VALUES('Film History',19);
INSERT INTO subgenres(name,genre_id) VALUES('Film Interviews',19);