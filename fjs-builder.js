import { promises as fs } from 'fs'
import path from 'path'
import fThis from './source/f-this.js'


const
sourceFolder = 'source',
distroFolder = 'distro'

async function* walk( dir ){

	for( const e of await fs.readdir( dir, { withFileTypes: true })){
		
		const p = path.join( dir, e.name )
		if( e.isDirectory() ) yield* walk( p )
		else yield p
	}
}
await fs.rm( distroFolder, { recursive: true, force: true })
await fs.mkdir( distroFolder, { recursive: true })
for await ( const file of walk( sourceFolder )){
	
	const 
	rel = path.relative( sourceFolder, file ),
	outPath = path.join( distroFolder, rel.replace( /\.fjs$/i, '.js' ))
	// outPath = path.join( distroFolder, rel )

	await fs.mkdir( path.dirname( outPath ), { recursive: true })
	if( file.endsWith( '.fjs' )){
	
		const 
		src = await fs.readFile( file, 'utf8' ),
		js = fThis( src )

		await fs.writeFile( outPath, js, 'utf8' )
	}
	else {
	
		await fs.copyFile( file, path.join( distroFolder, rel ))
	}
}
console.log( '“F-this” built ~/source → ~/distro with *.fjs transform.' )