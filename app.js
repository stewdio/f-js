import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import http from 'http'

const 
__filename = fileURLToPath( import.meta.url ),
__dirname = path.dirname( __filename ),
publicPath = path.join( __dirname, 'distro' ),
PORT = process.env.PORT || 4444

http.createServer(( req, res )=>{
  

	//  Default to index.html if the URL is '/'

	const safePath = req.url === '/' ? '/index.html' : req.url
	
	
	//  Prevent directory traversal attacks.

	const filePath = path.normalize( path.join( publicPath, safePath ))
	if( !filePath.startsWith( publicPath )){
	
		res.writeHead( 403, { 'Content-Type': 'text/plain; charset=utf-8' })
		return res.end( 'Forbidden' )
	}


	//  Guess content type (super minimal).
	
	const 
	ext = path.extname(filePath).toLowerCase(),
	contentTypes = {

		'.html': 'text/html; charset=utf-8',
		'.css':  'text/css; charset=utf-8',
		'.js':   'application/javascript; charset=utf-8',
		'.fjs':  'application/javascript; charset=utf-8',//  Just in case we decide to keep `.fjs` extension in the future?
		'.json': 'application/json; charset=utf-8',
		'.png':  'image/png',
		'.jpg':  'image/jpeg',
		'.gif':  'image/gif',
		'.svg':  'image/svg+xml; charset=utf-8'
	},
	contentType = contentTypes[ ext ] || 'application/octet-stream',
	stream = fs.createReadStream( filePath )

	stream.once( 'open', ()=>{
		
		res.writeHead( 200, { 'Content-Type': contentType })
		stream.pipe( res )
	})
	stream.once('error', ()=>{
		
		if( !res.headersSent ){
			
			res.writeHead( 404, { 'Content-Type': 'text/plain; charset=utf-8' })
			res.end( 'Not found' )
		}
		else {

			res.destroy()
		}
	})
})
.listen( PORT, ()=>{

	console.log( `Serving from ${ publicPath }` )
	console.log( `http://localhost:${ PORT }` )
})