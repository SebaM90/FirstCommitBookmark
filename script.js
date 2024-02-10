javascript: (function () {
  (([_, repo]) => {
    fetch(`https://github.com/${repo}`)
      .then((res) => res.text())
      .then((res) => {
        try {
          const mainDocument = new DOMParser().parseFromString(res, 'text/html');
          const reactPartial = mainDocument.querySelector('react-partial[data-ssr=true]>script')?.textContent;
          const jsonData = JSON.parse(reactPartial);
          const commitCountText = jsonData?.props?.initialPayload?.overview?.commitCount?.trim()?.replace(/,/g, '');
          const commitCount = parseInt(commitCountText);
          const commitId = jsonData?.props?.initialPayload?.refInfo?.currentOid;
          const branch = jsonData?.props?.initialPayload?.refInfo?.name;
          const url = `https://github.com/${repo}/commits/${branch}?after=${commitId}+${commitCount-10}`;
          console.log({commitCountText, commitCount, commitId, branch, url});
          window.location = url;
        } catch (error) {
          alert('Error: ' + error);
          console.log('ERROR', error);
        }
      });
  })(
    window.location.pathname.match(
      /\/([^\/]+\/[^\/]+)(?:\/(?:tree|commits|blob)\/([^\/]+))?/
    )
  );
})();
