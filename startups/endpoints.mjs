import genres from '../routes/Genres.mjs'
import categories from '../routes/categories.mjs'
import producers from '../routes/producers.mjs'
import tracks from '../routes/tracks.mjs'
import auth from '../routes/auth.mjs'

export default function endpoints(app){
    app.use('/api/genres/', genres)
    app.use('/api/categories/', categories)
    app.use('/api/producers/', producers)
    app.use('/api/tracks/', tracks)
    app.use('/api/auth/', auth)
}