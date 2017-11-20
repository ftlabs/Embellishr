<template>
          <nav class="navbar navbar-toggleable-md navbar-light bg-faded">
                <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
                </button>
                <a class="navbar-brand" href="#"><h2><strong>FT Labs</strong> - Embellishr</h2></a>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                       <router-link class="nav-link" to="/">Home</router-link>
                    </li>
                    <li class="nav-item">
                       <router-link class="nav-link" to="/kiosk">Kiosk</router-link>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" href="/api">API Docs</a>
                    </li>
                  </ul>
                </div>
              </nav>
</template>
