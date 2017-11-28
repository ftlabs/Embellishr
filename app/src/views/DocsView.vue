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

            <p>Kiosk mode displays the graphs for a sequence of terms and dates. The terms are specified in a 'data' query parameter, as a CSV of colon-separated terms.</p>
						<p>If the data parameter is not specified, the most recent few popular search terms are used instead.</p>

			<p><code>GET /kiosk?data=<var>{word}</var>:<var>{year}</var>:<var>{type}</var>,<var>{word}</var>:<var>{year}</var>:<var>{type}</var>&amp;interval=<var>{time}</var>&amp;num=<var>{num}</var></code></p>

            <p>e.g. /kiosk?data=brexit:2016:people,europe:2017:topics&amp;interval=5</p>
			<table>
				<tbody>
					<tr>
						<th>Param</th><th>Where</th><th>Description</th>
					</tr>
					<tr>
						<td><var>word</var></td>
						<td>URL</td>
						<td>
							Word (or term) to search for
						</td>
					</tr>
					<tr>
						<td><var>year</var></td>
						<td>URL</td>
						<td>
							<em>(optional, default=2017)</em> Specified year
						</td>
					</tr>
          <tr>
						<td><var>type</var></td>
						<td>URL</td>
						<td>
							<em>(optional, default=people)</em> Type of graph to display (<var>organisations</var>, <var>people</var>, <var>topics</var>)
						</td>
					</tr>
					<tr>
						<td><var>time</var></td>
						<td>URL</td>
						<td>
							<em>(optional, default=5)</em> Time to display each set of data (seconds)
						</td>
					</tr>
					<tr>
						<td><var>num</var></td>
						<td>URL</td>
						<td>
							<em>(optional, default=10)</em> Number of recent search terms to use if data is not specified
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
