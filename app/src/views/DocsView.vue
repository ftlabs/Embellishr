<template>
<div>
<div class="o-techdocs-container">
	<div class="o-techdocs-layout">
		<!-- Navigation - optional, omit for single page docs.  o-techdocs-sidebar container allows an in-page navigation list to be appended after the site navigation -->
		<div class="o-techdocs-sidebar">
			<ul class="o-techdocs-nav">
				<li><a href="#">API</a>
                	    <ul class="o-techdocs-nav o-techdocs-nav--sub">
						<li><a href="#api-full">Full</a></li>
						<li><a href="#api-summary">Summary</a></li>
						<li><a href="#api-condensed">Condensed</a></li>
					</ul>
				</li>
				<li><a href="#kiosk">Kiosk Mode</a></li>	
			</ul>
		</div>
		<div class="o-techdocs-main">
			<div class="o-techdocs-content">

			<h1>Embellishr Docs</h1>

            <h2 id="api">API</h2>

            <h3 id="api-full">Full</h3>

			<p>Gives the full amount of data, largely unaltered from the FT developer API.</p>

			<p><code>GET /api/<var>{word}</var>/<var>{year}</var></code></p>

			<table>
				<tbody>
					<tr>
						<th>Param</th><th>Where</th><th>Description</th>
					</tr><tr>
						<td><var>Word</var></td>
						<td>URL</td>
						<td>
							Word to search for
						</td>
					</tr><tr>
						<td><var>Year</var></td>
						<td>URL</td>
						<td>
							Specified year
						</td>
					</tr>
				</tbody>
			</table>

            <h3 id="api-summary">Summary</h3>

			<p>Gives a summary of the data, formated mostly using objects.</p>

			<p><code>GET /api/summary/<var>{word}</var>/<var>{year}</var></code></p>

			<table>
				<tbody>
					<tr>
						<th>Param</th><th>Where</th><th>Description</th>
					</tr><tr>
						<td><var>Word</var></td>
						<td>URL</td>
						<td>
							Word to search for
						</td>
					</tr><tr>
						<td><var>Year</var></td>
						<td>URL</td>
						<td>
							Specified year
						</td>
					</tr>
				</tbody>
			</table>


            <h3 id="api-condensed">Condensed</h3>

			<p>Gives the minimium amount of data, formated mostly using arrays.</p>

			<p><code>GET /api/condensed/<var>{word}</var>/<var>{year}</var></code></p>

			<table>
				<tbody>
					<tr>
						<th>Param</th><th>Where</th><th>Description</th>
					</tr><tr>
						<td><var>Word</var></td>
						<td>URL</td>
						<td>
							Word to search for
						</td>
					</tr><tr>
						<td><var>Year</var></td>
						<td>URL</td>
						<td>
							Specified year
						</td>
					</tr>
				</tbody>
			</table>

            <h2 id="kiosk">Kiosk Mode</h2>

            <p>Kiosk mode takes in a 'data' query parameter, allowing you to pass along a formated string to display the data.</p>

			<p><code>GET /kiosk?data=<var>{word}</var>:<var>{year}</var>:<var>{type}</var>,<var>{word}</var>:<var>{year}</var>:<var>{type}</var>&amp;interval=<var>{time}</var></code></p>

            <p>e.g. /kiosk?data=brexit:2016:people,europe:2017:topics&amp;interval=5</p>
			<table>
				<tbody>
					<tr>
						<th>Param</th><th>Where</th><th>Description</th>
					</tr><tr>
						<td><var>Word</var></td>
						<td>URL</td>
						<td>
							Word to search for
						</td>
					</tr><tr>
						<td><var>Year</var></td>
						<td>URL</td>
						<td>
							Specified year
						</td>
					</tr>
                    <tr>
						<td><var>Type</var></td>
						<td>URL <em>(optional)</em></td>
						<td>
							Type of graph to display (<var>organisations</var>, <var>people</var>, <var>topics</var>)
						</td>
					</tr>
                    <tr>
						<td><var>Time</var></td>
						<td>URL <em>(optional - 5s default)</em></td>
						<td>
							Time to display each set of data (seconds)
						</td>
					</tr>
				</tbody>
			</table>		
		</div>
	</div> 
</div>
<footer class="o-techdocs-footer">
	<div class="o-techdocs-footer__inner">
		<p class="o-techdocs-footer__secondary"><a href="#">Back to top</a></p>
	</div>
</footer>
</div>
</template>
