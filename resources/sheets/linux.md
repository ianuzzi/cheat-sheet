---
title: linux
order: 40
icon: server
---

# Linux commands

A reference for common shell commands. Bracketed bits like `[file]` are placeholders.

## Files and directories

::: entries
ls -la                >>  List all files, long form, with hidden
ls -lh                >>  Long list with human-readable sizes
cd -                  >>  Switch to previous directory
pwd                   >>  Print working directory
mkdir -p a/b/c        >>  Create nested directories
cp -r src dest        >>  Copy recursively
mv src dest           >>  Move or rename
rm -rf path           >>  Recursive force delete (careful!)
ln -s target name     >>  Create symbolic link
stat file             >>  Show detailed file metadata
file path             >>  Identify file type
:::

## Searching

::: entries
find . -name '*.ts'   >>  Find files by name pattern
find . -type f -mtime -1  >>  Files modified within last day
grep -rni 'pat' .     >>  Recursive case-insensitive search
grep -E 'a|b'         >>  Extended regex
which cmd             >>  Locate executable in PATH
whereis cmd           >>  Locate binary, source, manpage
locate name           >>  Search filesystem index
:::

## Processes

::: entries
ps aux                >>  List all processes
ps -ef --forest       >>  Process tree
top                   >>  Live process viewer
htop                  >>  Better top (if installed)
kill PID              >>  Send TERM signal
kill -9 PID           >>  Force kill (SIGKILL)
pkill name            >>  Kill by name
pgrep name            >>  Find PIDs by name
jobs                  >>  List shell jobs
fg / bg               >>  Foreground / background last job
nohup cmd &           >>  Run detached, ignore hangup
:::

## Permissions

::: entries
chmod +x file         >>  Add execute bit
chmod 755 file        >>  rwxr-xr-x
chown user:grp file   >>  Change owner and group
sudo cmd              >>  Run as root
sudo -i               >>  Interactive root shell
umask                 >>  Show default permission mask
:::

## Disk and network

::: entries
df -h                 >>  Disk free, human-readable
du -sh dir            >>  Total size of directory
mount                 >>  Show mounted filesystems
lsblk                 >>  List block devices
ip a                  >>  Show network interfaces
ip r                  >>  Show routing table
ss -tulpn             >>  Listening sockets with PIDs
curl -I url           >>  Fetch headers only
wget url              >>  Download a file
:::

## Archives

::: entries
tar -czf out.tgz dir  >>  Create gzip tarball
tar -xzf in.tgz       >>  Extract gzip tarball
tar -tzf in.tgz       >>  List contents
zip -r out.zip dir    >>  Create zip
unzip in.zip          >>  Extract zip
:::

## Misc

::: entries
history               >>  Shell command history
!!                    >>  Run last command
!$                    >>  Last argument of last command
Ctrl+R                >>  Reverse-search history
man cmd               >>  Manual page
cmd --help            >>  Built-in help
date                  >>  Current date/time
uname -a              >>  Kernel and OS info
uptime                >>  System uptime + load
:::
