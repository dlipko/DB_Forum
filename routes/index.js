import user from './user';
import forum from './forum';
import thread from './thread';
/*
import post from './post';
import service from './service'; */


export default function query(app) {
  app.use('/api/user', user);
  app.use('/api/forum', forum);
  // app.use('/api/thread', thread);
  /*
  app.use('/post', post);
  app.use('service', service);
   */
}



