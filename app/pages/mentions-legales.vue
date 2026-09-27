<template>
  <LegalPage
    title="Mentions légales"
    title-accent="qui se cache derrière Ticawa."
    intro="Qui édite Ticawa, qui l'héberge et à qui appartiennent ses contenus."
  >
    <LegalSection title="Éditeur du site">
      <p>
        Le site et l'application Ticawa sont édités par
        <strong>Alexandre-Philippe Perez</strong>, entrepreneur individuel
        (micro-entreprise), exerçant sous le nom commercial
        <a href="https://fablioo.com" target="_blank" rel="noopener">Fablioo</a
        >.
      </p>
      <ul>
        <li><strong>SIRET :</strong> 983 452 731 00018</li>
        <li>
          <strong>Adresse :</strong> Terr. Jean Renaudie, 38400
          Saint-Martin-d'Hères, France
        </li>
        <li>
          <strong>Téléphone : </strong>
          <a href="tel:+33630754686">06 30 75 46 86</a>
        </li>
        <li>
          <strong>Contact : </strong>
          <a href="mailto:perezalexandre430@gmail.com"
            >perezalexandre430@gmail.com</a
          >
        </li>
        <li>
          <strong>Directeur de la publication :</strong> Alexandre-Philippe
          Perez
        </li>
      </ul>
    </LegalSection>

    <LegalSection title="Nature du projet">
      <UiLabelCard tone="trust">
        <p>
          Ticawa est un projet <strong>bénévole</strong>, gratuit et sans
          publicité. Il n'a pas de but commercial.
        </p>
      </UiLabelCard>
    </LegalSection>

    <LegalSection title="Hébergement">
      <h3>Site</h3>
      <p>
        <strong>Vercel Inc.</strong>, 440 N Barranca Ave #4133, Covina, CA
        91723, États-Unis (<a
          href="https://vercel.com"
          target="_blank"
          rel="noopener"
          >vercel.com</a
        >).
      </p>
      <h3>Données des comptes</h3>
      <p>
        Hébergées dans l'Union européenne. Le prestataire concerné sera indiqué
        ici dès son choix définitif.
      </p>
    </LegalSection>

    <LegalSection title="Propriété intellectuelle">
      <p>
        Le nom Ticawa, son logo, la mascotte Tico, les textes, illustrations et
        éléments graphiques du site sont la propriété de l'éditeur.
      </p>
      <p>
        Toute reproduction ou réutilisation, totale ou partielle, sans
        autorisation écrite préalable est interdite.
      </p>
    </LegalSection>

    <LegalSection title="Informations fournies">
      <p>
        Les informations présentées sur les garanties et assurances sont
        générales et données à titre indicatif. Elles ne constituent pas un
        conseil juridique.
      </p>
      <UiLabelCard>
        <p>
          Ticawa informe et alerte, mais n'effectue aucune démarche à la place
          de l'utilisateur.
        </p>
      </UiLabelCard>
    </LegalSection>

    <LegalSection title="Données personnelles">
      <p>
        Le traitement de vos données est décrit dans la
        <NuxtLink to="/confidentialite">politique de confidentialité</NuxtLink>.
      </p>
    </LegalSection>
  </LegalPage>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Mentions légales",
  description:
    "Mentions légales de Ticawa : éditeur, directeur de la publication, hébergeur et propriété intellectuelle.",
});
</script>
