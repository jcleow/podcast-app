const rawIframeUrlArray = [
  '<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/363307148&color=%23310b09&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/criminalshow" title="CriminalShow" target="_blank" style="color: #cccccc; text-decoration: none;">CriminalShow</a> · <a href="https://soundcloud.com/criminalshow/episode-80-photo-hair-fingerprint" title="Episode 80: Photo, Hair, Fingerprint" target="_blank" style="color: #cccccc; text-decoration: none;">Episode 80: Photo, Hair, Fingerprint</a></div>',
  '<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/356824517&color=%23310b09&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/criminalshow" title="CriminalShow" target="_blank" style="color: #cccccc; text-decoration: none;">CriminalShow</a> · <a href="https://soundcloud.com/criminalshow/episode-79-secrets-and-seances" title="Episode 79: Secrets and Séances" target="_blank" style="color: #cccccc; text-decoration: none;">Episode 79: Secrets and Séances</a></div>',
  '<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/350326810&color=%23310b09&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/criminalshow" title="CriminalShow" target="_blank" style="color: #cccccc; text-decoration: none;">CriminalShow</a> · <a href="https://soundcloud.com/criminalshow/episode-78-the-botanist" title="Episode 78: The Botanist" target="_blank" style="color: #cccccc; text-decoration: none;">Episode 78: The Botanist</a></div>',
  '<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/347722095&color=%23310b09&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/criminalshow" title="CriminalShow" target="_blank" style="color: #cccccc; text-decoration: none;">CriminalShow</a> · <a href="https://soundcloud.com/criminalshow/episode-77-the-escape" title="Episode 77: The Escape" target="_blank" style="color: #cccccc; text-decoration: none;">Episode 77: The Escape</a></div>',
  '<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/345526603&color=%23310b09&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/criminalshow" title="CriminalShow" target="_blank" style="color: #cccccc; text-decoration: none;">CriminalShow</a> · <a href="https://soundcloud.com/criminalshow/episode-76-the-big-lick" title="Episode 76: The Big Lick" target="_blank" style="color: #cccccc; text-decoration: none;">Episode 76: The Big Lick</a></div>',
];

let refinedUrlArray;
const convert = () => {
  refinedUrlArray = rawIframeUrlArray.map((url) => {
    const regex = new RegExp(/\bhttps.+?show_teaser=true\b/);
    const refinedUrl = url.match(regex)[0];
    return refinedUrl;
  });
  return refinedUrlArray;
};

convert(rawIframeUrlArray);
console.log(refinedUrlArray, '2');